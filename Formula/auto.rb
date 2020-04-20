class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.28.1/auto-macos.gz"
  version "v9.28.1"
  sha256 "b0a539ca92972d8b6c61d91b5791f290ab54b241412fc0ddc855e636a33798a1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end