FROM ruby:3.1.3-alpine as builder

RUN apk add --no-cache build-base postgresql-dev
# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1
WORKDIR /app
COPY Gemfile Gemfile.lock /app/
RUN bundle install

FROM ruby:3.1.3-alpine
LABEL org.opencontainers.image.source https://github.com/Moser-ss/gifmachine
EXPOSE 4567
WORKDIR /app
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "4567"]
RUN apk add --no-cache postgresql15-client
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY . /app/

## TODO
# * Find a way to add user nobody and allow to use the bundle binary
# * Understand why the app needs the rackup to start insided of the container