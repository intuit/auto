class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.12.1/auto-macos.gz"
  version "v10.12.1"
  sha256 "b7fe7abd838da0e9e0f06e60e82e34439f7c219a91fd204e80cf39f50c434c2d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end