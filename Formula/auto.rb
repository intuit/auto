class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.1/auto-macos.gz"
  version "v10.37.1"
  sha256 "7e4a0ddd6313288b148a8ab43b17fb640845f08dc6a91d0048bf5108b1d43a1e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end