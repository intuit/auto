class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.38.0/auto-macos.gz"
  version "v10.38.0"
  sha256 "70cdc680ac5562604afd48da40f86417b807f0dd30fcb73e6cbd33acd86d454a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end