class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.29.2/auto-macos.gz"
  version "v10.29.2"
  sha256 "0ae48286fb39e3d2c256f3f018bf566637202d26f64237d826efe770498c9f72"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end