class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.24.0/auto-macos.gz"
  version "v10.24.0"
  sha256 "5c6ab6b0495084b5b2b5cf6dfbdb7db27376a4586946568667006ae9d0eff374"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end