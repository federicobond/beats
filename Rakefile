require "rake"

desc "Package assets"
task :assets do
  sh "component build"
  sh "mv build/build.js public/js/"
  sh "mv build/build.css public/css/"
  sh "rmdir build"
end
