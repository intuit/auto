class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.29.3/auto-macos.gz"
  version "v10.29.3"
  sha256 "d8fd59133b4d9f1137b145527650d4d32e84c24a28b3cb2dfe74594108b5425c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end