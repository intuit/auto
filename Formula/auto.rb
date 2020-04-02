class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.23.1/auto-macos.gz"
  version "v9.23.1"
  sha256 "4de79001cfd6234f376a4cd59eab4fd97a6d8d8c22d01a6b79a234e6843e4c5e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end