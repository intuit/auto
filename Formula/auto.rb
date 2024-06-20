class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.1.6/auto-macos.gz"
  version "v11.1.6"
  sha256 "bd28829b13a3f5e62610e400b64f68546dd2ebdec79d7d2da82f9323c9ead953"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end