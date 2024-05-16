class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/$VERSION/auto-macos.gz"
  version "$VERSION"
  sha256 "$SHA"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos-x64"
    mv bin/"auto-macos-x64", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end