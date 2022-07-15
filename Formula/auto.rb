class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.2/auto-macos.gz"
  version "v10.37.2"
  sha256 "a900e400c51a35ebba239deda1f81deaa7094e8bea7d0e069f4c1e60ce33dc88"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end