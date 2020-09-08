class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.53.0/auto-macos.gz"
  version "v9.53.0"
  sha256 "73e19bfa81bcb099a1bc1e5b859d3431c7131196bc9a3b5c86af40fa0ee5be57"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end