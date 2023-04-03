class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.44.0/auto-macos.gz"
  version "v10.44.0"
  sha256 "cba7e6cfcac2ae108d4ce7c3e15be50615134def26b20b78cfc9ecdc8681cf67"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end