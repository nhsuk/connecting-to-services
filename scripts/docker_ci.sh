#!/usr/bin/env bash

PUSH_TO_DOCKER=true
DOCKER_REPO="nhsuk/connecting-to-services"
TAGS=""
TEMP_IMAGE_NAME="temp_nhsuk_docker_image"
DOCKERFILE="Dockerfile"

info() {
  printf "%s\n" "$@"
}

fatal() {
  printf "**********\n"
  printf "%s\n" "$@"
  printf "**********\n"
  exit 1
}

fold_start() {
  if [[ -n $TRAVIS ]]; then
    printf "%s\n" "travis_fold:start:$@"
  fi
}

fold_end() {
  if [[ -n $TRAVIS ]]; then
    printf "%s\n" "travis_fold:end:$@"
  fi
}


# CREATE ARRAY OF DOCKER TAGS WE'RE GOING TO APPLY TO THE IMAGE
if [[ -n "$TRAVIS" ]]; then

  echo "Travis detected"
  # ALWAYS BUILD THE COMMIT ID AND THE BRANCH
  TAGS="$TAGS $CURRENT_COMMIT"
  SANITISED_BRANCH=$( echo $TRAVIS_BRANCH | sed 's/\//_/g' )
  TAGS="$TAGS $TRAVIS_BRANCH"

  # IF MASTER BRANCH ALWAYS SET THE LATEST TAG
  if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAGS="$TAGS latest"
  fi

  # IF PULL REQUEST BUILD, CREATE TAG FOR PR
  if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "Pull Request build detected, adding pr-${TRAVIS_PULL_REQUEST} to the docker tags"
    TAGS="$TAGS pr-${TRAVIS_PULL_REQUEST}"
  fi

  # ADD TAG BRANCH
  if [ -n "TRAVIS_TAG" ]; then
    echo "Tag detected, adding ${TRAVIS_TAG} to the docker tags"
    TAGS="$TAGS $TRAVIS_TAG"
  fi

else
  currentBranch=$(git rev-parse --abbrev-ref HEAD | sed 's/\//_/g')
  TAGS="${TAGS} $currentBranch"
  currentCommit=$(git rev-parse --short HEAD)
  TAGS="${TAGS} $currentCommit"
  if [ "$currentBranch"=="master" ]; then
    TAGS="${TAGS} latest"
  fi
fi

echo $TAGS

fold_start "Building Docker Images"

fold_start "Building Default Image"
info "Building default image"
docker build -t ${TEMP_IMAGE_NAME} -f $DOCKERFILE .

if [[ $? -gt 0 ]]; then
  fatal "Build failed!"
else
  info "Build succeeded."
fi
fold_end "Building Default Image"

if [ "$PUSH_TO_DOCKER" = true ]; then
  fold_start "Tagging and pushing images to docker hub"

  for TAG in $TAGS; do
    fold_start "Tagging '$TAG' and pushing to docker hub"
    docker tag $TEMP_IMAGE_NAME ${DOCKER_REPO}:${TAG}
    docker push ${DOCKER_REPO}:${TAG}
    fold_end "Tagging '$TAG' and pushing to docker hub"
  done

  fold_end "Tagging and pushing images to docker hub"

fi

info "All builds successful!"

exit 0
