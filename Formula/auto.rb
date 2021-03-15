class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.4/auto-macos.gz"
  version "v10.20.4"
  sha256 "74697f494dafbe01804a0d52aacc623560a7d1a0b96a8cfd7652c5a024a05e2f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end