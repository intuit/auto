class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.27.0/auto-macos.gz"
  version "v9.27.0"
  sha256 "19df0a766192cb5e038341168d68aeb92236edca03c49ccc4250eec7a05690bc"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end