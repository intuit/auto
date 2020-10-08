class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.57.0/auto-macos.gz"
  version "v9.57.0"
  sha256 "9cb64d4d04b2bb170971dd39eec36aff1ac0012efe8a55fd829e23aa9b56119e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end