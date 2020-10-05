class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.54.2/auto-macos.gz"
  version "v9.54.2"
  sha256 "e579f501752ac0164b7825340d77da73316e87f9ea8ce2fde39d1f216a6dbeb8"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end