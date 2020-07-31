class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.49.2/auto-macos.gz"
  version "v9.49.2"
  sha256 "6f5979aa3629e270eab0c5734b3606a6764e01f0e63ff0a0806f2201cc668fb3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end