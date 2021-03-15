class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.2/auto-macos.gz"
  version "v10.20.2"
  sha256 "cd04945f80fee9eaba20483d197818e76f8deaea7278fe94e76d03412c1f7eaa"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end