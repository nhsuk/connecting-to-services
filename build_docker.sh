#!/usr/bin/env bash

set -u
IFS=$'\n\t'

push_to_docker=true
docker_repo="connecting-to-services"
docker_registry="nhsuk"

currentBranch=`git rev-parse --abbrev-ref HEAD`
currentBranchSanitised=`echo $currentBranch | sed 's/\//_/g'`
currentCommit=`git rev-parse --short HEAD`

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
  printf "%s\n" "travis_fold:start:$@"
}

fold_end() {
  printf "%s\n" "travis_fold:end:$@"
}

push_to_dockerhub() {

  docker push "$@"
  if [[ $? -gt 0 ]]; then
    fatal "Push of $@ failed!"
  else
    info "Push of $@ succeeded"
  fi

}

fold_start "Building Docker Images"

dockerfile_dir="dockerfiles"
[ -f "$dockerfile_dir/Dockerfile" ] || continue

fold_start "Building Default Image"
info "Building default image"
docker build -t $docker_repo -f $dockerfile_dir/Dockerfile .

if [[ $? -gt 0 ]]; then
  fatal "Build failed!"
else
  info "Build succeeded."
fi
fold_end "Building Default Image"


fold_start "Building variant images"
variants=$(echo $dockerfile_dir/*/ | xargs -n1 basename)
for variant in $variants; do
  # Skip non-docker directories
  [ -f "$dockerfile_dir/$variant/Dockerfile" ] || continue

  fold_start "Building $variant Image"
  info "Building $docker_repo:$variant variant..."
  docker build -t $docker_repo:$variant -f $dockerfile_dir/$variant/Dockerfile .

  if [[ $? -gt 0 ]]; then
    fatal "Build of $variant failed!"
  else
    info "Build of $variant succeeded."
  fi
  fold_end "Building $variant Image"

done
fold_end "Building variant images"


if [ "$push_to_docker" = true ]; then
  fold_start "Tagging and pushing images to docker hub"

  fold_start "Default Image"
  docker tag $docker_repo $docker_registry/$docker_repo
  push_to_dockerhub $docker_registry/$docker_repo

  docker tag $docker_repo $docker_registry/$docker_repo:$currentBranchSanitised
  push_to_dockerhub $docker_registry/$docker_repo:$currentBranchSanitised

  docker tag $docker_repo $docker_registry/$docker_repo:$currentCommit
  push_to_dockerhub $docker_registry/$docker_repo:$currentCommit

  fold_end "Default Image"

  for variant in $variants; do
    # Skip non-docker directories
    [ -f "$dockerfile_dir/$variant/Dockerfile" ] || continue

    fold_start "$variant variant image"
    docker tag $docker_repo:$variant $docker_registry/$docker_repo:$variant
    push_to_dockerhub $docker_registry/$docker_repo:$variant

    docker tag $docker_repo:$variant $docker_registry/$docker_repo:$variant-$currentBranchSanitised
    push_to_dockerhub $docker_registry/$docker_repo:$variant-$currentBranchSanitised

    docker tag $docker_repo:$variant $docker_registry/$docker_repo:$variant-$currentCommit
    push_to_dockerhub $docker_registry/$docker_repo:$variant-$currentCommit

    fold_end "$variant variant image"

  done

  fold_end "Tagging and pushing images to docker hub"

fi

info "All builds successful!"

exit 0
