/*
 *  Web Browser plugin for Movian Media Center
 *
 *  Copyright (C) 2015-2018 lprot
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var page = require('showtime/page');
var http = require('showtime/http');
var service = require('showtime/service');
var plugin = JSON.parse(Plugin.manifest);
var logo = Plugin.path + plugin.icon;

new page.Route("webbrowse:(.*)", function(page, url) {
    page.metadata.title = plugin.title;
    page.metadata.logo = logo;
    page.type = "directory";
    page.contents = "items";
    if (!url.trim().length)
        url = 'http://movian.tv';
    if (!url.match(/http/))
        url = 'http://' + url;
    page.appendPassiveItem('file', '', {
        title: 'Browsing: ' + url
    });
    var json = require('native/popup').webpopup(url, url, null);
    page.flush();
    if (json.result != 'userclose') 
        page.appendPassiveItem('file', '', {
            title: "Can't open: " + url
        });
    else
        page.appendPassiveItem('file', '', {
            title: "Browser was closed"
        });    
});

service.create(plugin.title, plugin.id + ":start", 'other', true, logo);

new page.Route(plugin.id + ":start", function(page) {
    page.metadata.title = plugin.title;
    page.metadata.logo = logo;
    page.type = "directory";
    page.contents = "items";
    page.appendItem("webbrowse:", 'search', {
        title: 'Please enter URL...'
    });
});
