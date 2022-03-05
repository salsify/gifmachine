FROM ruby:3.1.1 as builder
# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1
WORKDIR /app
COPY Gemfile Gemfile.lock /app/
RUN bundle install

FROM ruby:3.1.1-alpine3.15
LABEL org.opencontainers.image.source https://github.com/Moser-ss/gifmachine
EXPOSE 4567
WORKDIR /app
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "4567"]
COPY --from=builder /app /app
COPY . /app/

## TODO
# * Find a way to add user nobody and allow to use the bundle binary
# * Understand why the app needs the rackup to start insided of the container