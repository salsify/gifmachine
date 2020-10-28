FROM ruby:2.6.5

EXPOSE 4567

RUN gem install bundler -v 2.0.2

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

WORKDIR /app

CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "4567"]

COPY Gemfile Gemfile.lock /app/
RUN bundle install

COPY . /app/