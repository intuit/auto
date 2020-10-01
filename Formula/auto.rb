class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.54.0/auto-macos.gz"
  version "v9.54.0"
  sha256 "153ab9b14a7cce8046c802de92b784123aa93ed880d4f40185c3bc034cb00e29"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end