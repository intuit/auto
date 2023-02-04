class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.6/auto-macos.gz"
  version "v10.37.6"
  sha256 "face892e3cf32c6ab28e7693a94f93c5cbc22fb4e1fd0f6a5bec5eaac15409b5"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end