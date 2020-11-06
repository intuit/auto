class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.2.4/auto-macos.gz"
  version "v10.2.4"
  sha256 "fcfa54235ef9bec043d553912dcddf458d5a2dd5df55e35a06371b510ff0dbe4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end