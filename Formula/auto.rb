class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.28.0/auto-macos.gz"
  version "v9.28.0"
  sha256 "a1a8b13b2428402a527d827d4d6c84d5396550dbe4252fb1b1fa73972fd6441e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end