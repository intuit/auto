class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.2.1/auto-macos.gz"
  version "v10.2.1"
  sha256 "ff732d8952e3c54266d8b83f951ed6ee75982b0d66ae93fc9e7a498e3916b58a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end