#!/usr/bin/env bash

set -u
IFS=$'\n\t'

push_to_docker=true
docker_repo="nhsuk/connecting-to-services"

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

fold_start "Building Docker Images"

dockerfile_dir="dockerfiles"
[ -f "$dockerfile_dir/Dockerfile" ] || continue

fold_start "Building Default Image"
info "Building default image"
docker build -t ${docker_repo}:${currentCommit} -f $dockerfile_dir/Dockerfile .

if [[ $? -gt 0 ]]; then
  fatal "Build failed!"
else
  info "Build succeeded."
fi
fold_end "Building Default Image"

if [ "$push_to_docker" = true ]; then
  fold_start "Tagging and pushing images to docker hub"

  fold_start "Default Image"
  docker push ${docker_repo}:${currentCommit}

  docker tag ${docker_repo}:${currentCommit} ${docker_repo}:${currentBranchSanitised}
  docker push ${docker_repo}:${currentBranchSanitised}
  fold_end "Default Image"

  fold_end "Tagging and pushing images to docker hub"

fi

info "All builds successful!"

exit 0
