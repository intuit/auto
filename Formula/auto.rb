class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.24.3/auto-macos.gz"
  version "v10.24.3"
  sha256 "2894bec92dd1f7311d351cfef8ab510e32d2c900d485fd722c4e4d8092354f1f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end