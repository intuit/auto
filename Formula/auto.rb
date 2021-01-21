class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.12.2/auto-macos.gz"
  version "v10.12.2"
  sha256 "1e9f7e3e71d61f1b72cb76142eeecace84d90dc3794fdfc55449d5eb9dcac42f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end