# frozen_string_literal: true

source "https://rubygems.org"

gemspec

gem "html-proofer", "~> 5.0", group: :test

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]

# 커스텀
gem 'jekyll-redirect-from'
gem 'jekyll-seo-tag', git: 'https://github.com/hynrng/jekyll-seo-tag.git', branch: 'master'
