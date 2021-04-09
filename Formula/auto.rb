class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.24.2/auto-macos.gz"
  version "v10.24.2"
  sha256 "76ad3f5dfd61bf0481ce340d9cdccbdb1cc0de88b5af4c31000b82aa2a711ad3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end