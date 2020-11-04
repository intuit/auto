class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.2.3/auto-macos.gz"
  version "v10.2.3"
  sha256 "a5415190dd58ddca85d9755d24448d143b6cd7d7f71b696b6cd8bfb4e332215a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end