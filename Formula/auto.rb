class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.3.0/auto-macos.gz"
  version "v10.3.0"
  sha256 "1057be9d40e6b0132377630c2041b195aaa8dbff3cbc3a6915d47a617b944145"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end