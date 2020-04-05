class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.25.3/auto-macos.gz"
  version "v9.25.3"
  sha256 "42fe1f0b4229b24aa8f34b023f87f2ce5b2764ab8aade51ccfca4544b4ce7ba9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end