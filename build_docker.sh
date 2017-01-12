#!/usr/bin/env bash

set -uo pipefail
IFS=$'\n\t'

push_to_docker=true
docker_repo="connecting-to-services"
docker_registry="nhsuk"

info() {
  printf "%s\n" "$@"
}

fatal() {
  printf "**********\n"
  printf "%s\n" "$@"
  printf "**********\n"
  exit 1
}
dockerfile_dir="dockerfiles"
[ -f "$dockerfile_dir/Dockerfile" ] || continue

info "Building..."
BUILD_OUTPUT=$(docker build -t $docker_repo -f $dockerfile_dir/Dockerfile . )

if [[ $? -gt 0 ]]; then
  fatal "Build failed!"
  fatal $BUILD_OUTPUT
else
  info "Build succeeded."
fi

if [ "$push_to_docker" = true ]; then
  docker tag $docker_repo $docker_registry/$docker_repo
  docker push $docker_registry/$docker_repo
fi


variants=$(echo $dockerfile_dir/*/ | xargs -n1 basename)

for variant in $variants; do
  # Skip non-docker directories
  [ -f "$dockerfile_dir/$variant/Dockerfile" ] || continue

  info "Building $docker_repo:$variant variant..."
  BUILD_OUTPUT=$(docker build -t $docker_repo:$variant -f $dockerfile_dir/$variant/Dockerfile . )

  if [[ $? -gt 0 ]]; then
    fatal "Build of $variant failed!"
    fatal $BUILD_OUTPUT
  else
    info "Build of $variant succeeded."
  fi

  if [ "$push_to_docker" = true ]; then
    docker tag $docker_repo:$variant $docker_registry/$docker_repo:$variant
    docker push $docker_registry/$docker_repo:$variant
  fi

done

info "All builds successful!"

exit 0
