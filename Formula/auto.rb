class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.38.5/auto-macos.gz"
  version "v10.38.5"
  sha256 "9f3e29b205b36b6a4d8499eb3a11416edd9855173b696f10932eeb6e00070dc3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end