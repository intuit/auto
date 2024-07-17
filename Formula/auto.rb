class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.2.0/auto-macos.gz"
  version "v11.2.0"
  sha256 "606f930530a64ed9aa3240e0c49e6d139b9011f1fad9591f482d777eae7b03ee"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end