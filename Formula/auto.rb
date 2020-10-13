class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.58.0/auto-macos.gz"
  version "v9.58.0"
  sha256 "0d2f8b36b7dfeb763560de824c4dcd0b3fdbfcb64d5e384497feff9fe0aaba9e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end