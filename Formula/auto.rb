class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.32.5/auto-macos.gz"
  version "v10.32.5"
  sha256 "c1bbea44715953407e5c43fc911cdf6e1f494e2fb6db34f261a5d06d0efa363f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end