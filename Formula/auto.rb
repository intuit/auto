class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.0/auto-macos.gz"
  version "v10.18.0"
  sha256 "e46ba4be0c860cd0b540bdf82da8ada2630f4ee88f94ea2b871e3d5e47ba1ec2"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end