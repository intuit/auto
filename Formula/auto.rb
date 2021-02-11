class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.2/auto-macos.gz"
  version "v10.16.2"
  sha256 "28c0e9c8c25d81e05a97318e31ed3e1bbf0ad2d62dae3d15c3d63a68d7658b02"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end