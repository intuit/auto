class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.49.3/auto-macos.gz"
  version "v9.49.3"
  sha256 "84ea185d773cbe145ed9968af5858d9b536c4b07f600c142098a3092e8cefbb9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end