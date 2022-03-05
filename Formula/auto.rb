class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.34.1/auto-macos.gz"
  version "v10.34.1"
  sha256 "5722a3a0fcf573e85d163860c526bb07364241ad406dbb70f4e54a798e747545"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end