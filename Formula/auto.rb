class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.56.0/auto-macos.gz"
  version "v9.56.0"
  sha256 "76f65ff39e8852583b336533a8e9ca7be768df8fb4bae7ce6f553c4118b0fd73"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end