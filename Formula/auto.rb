class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.54.1/auto-macos.gz"
  version "v9.54.1"
  sha256 "6ce1513cd3098df402e72488686fe7600113a8c3dd1c772a0cbaf8a87d8b1c72"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end