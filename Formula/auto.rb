class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.54.4/auto-macos.gz"
  version "v9.54.4"
  sha256 "7a81ed13661f7a51b7aaf042f97243306c0e53ca0d15dee4fbbf306fe05423c2"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end