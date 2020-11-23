class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.4.1/auto-macos.gz"
  version "v10.4.1"
  sha256 "f097238c90df65e6648fc3854bdc334b20a804ec55713cfb852596e2982b77f5"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end