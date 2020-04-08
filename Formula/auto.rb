class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.26.7/auto-macos.gz"
  version "v9.26.7"
  sha256 "e5ac3517a033771c4eb97c484cb02183a421eeb12840ce924062a233dd2b2bed"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end