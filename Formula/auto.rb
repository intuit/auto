class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.32.2/auto-macos.gz"
  version "v9.32.2"
  sha256 "5084e4ad93d9eaa48574a5cc95a3fcb00cde95cb7f6c6ec28c3c180442cf500d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end