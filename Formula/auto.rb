class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.27.3/auto-macos.gz"
  version "v9.27.3"
  sha256 "4bd22390e07f259b8f9f3fb2472eb606ec6c2511f602f2ff293b95ca91a35667"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end